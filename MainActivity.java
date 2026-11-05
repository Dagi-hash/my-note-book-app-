package com.dagi.notebook;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.os.Bundle;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.webkit.JavascriptInterface;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.BridgeActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

public class MainActivity extends BridgeActivity {
    private static final String KEY_ALIAS = "notebook_bio_key";
    private static final String PREFS = "notebook_bio";
    private String pendingShare = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        captureShare(getIntent());
        getBridge().getWebView().addJavascriptInterface(new Native(), "NBNative");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        captureShare(intent);
    }

    private void captureShare(Intent intent) {
        if (intent == null) return;
        String act = intent.getAction();
        try {
            String text = null, subject = null;
            if (Intent.ACTION_SEND.equals(act)) {
                text = intent.getStringExtra(Intent.EXTRA_TEXT);
                subject = intent.getStringExtra(Intent.EXTRA_SUBJECT);
                if (text == null) {
                    Uri u = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
                    if (u != null) { text = readText(u); if (subject == null) subject = nameOf(u); }
                }
            } else if (Intent.ACTION_VIEW.equals(act) && intent.getData() != null) {
                Uri u = intent.getData();
                text = readText(u);
                subject = nameOf(u);
            }
            if (text == null && subject == null) return;
            JSONObject o = new JSONObject();
            o.put("s", subject == null ? "" : subject);
            o.put("t", text == null ? "" : text);
            pendingShare = o.toString();
        } catch (Exception ignored) { }
    }

    private String readText(Uri u) {
        try (InputStream in = getContentResolver().openInputStream(u)) {
            if (in == null) return null;
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n, total = 0;
            while ((n = in.read(buf)) > 0 && total < 600000) { out.write(buf, 0, n); total += n; }
            return out.toString("UTF-8");
        } catch (Exception e) {
            return null;
        }
    }

    private String nameOf(Uri u) {
        try (Cursor c = getContentResolver().query(u, null, null, null, null)) {
            if (c != null && c.moveToFirst()) {
                int i = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (i >= 0) { String n = c.getString(i); return n == null ? null : n.replaceAll("\\.[^.]+$", ""); }
            }
        } catch (Exception ignored) { }
        return null;
    }

    private SecretKey bioKey() throws Exception {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
        ks.load(null);
        if (ks.containsAlias(KEY_ALIAS)) return (SecretKey) ks.getKey(KEY_ALIAS, null);
        KeyGenerator kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        kg.init(new KeyGenParameterSpec.Builder(KEY_ALIAS, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build());
        return kg.generateKey();
    }

    private String readSecret() {
        try {
            SharedPreferences p = getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String iv = p.getString("iv", null), ct = p.getString("ct", null);
            if (iv == null || ct == null) return null;
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, bioKey(), new GCMParameterSpec(128, Base64.decode(iv, Base64.NO_WRAP)));
            return new String(c.doFinal(Base64.decode(ct, Base64.NO_WRAP)), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }

    private void reply(final String id, final boolean ok, final String secret) {
        final String js = "window.__nbBio&&window.__nbBio(" + JSONObject.quote(id) + "," + ok + "," + JSONObject.quote(secret == null ? "" : secret) + ")";
        runOnUiThread(new Runnable() {
            @Override public void run() { getBridge().getWebView().evaluateJavascript(js, null); }
        });
    }

    public class Native {
        @JavascriptInterface
        public String takeShare() {
            String s = pendingShare;
            pendingShare = null;
            return s;
        }

        @JavascriptInterface
        public boolean bioAvailable() {
            try {
                return BiometricManager.from(MainActivity.this)
                        .canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) == BiometricManager.BIOMETRIC_SUCCESS;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean bioSave(String secret) {
            try {
                Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
                c.init(Cipher.ENCRYPT_MODE, bioKey());
                byte[] ct = c.doFinal(secret.getBytes(StandardCharsets.UTF_8));
                getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                        .putString("iv", Base64.encodeToString(c.getIV(), Base64.NO_WRAP))
                        .putString("ct", Base64.encodeToString(ct, Base64.NO_WRAP))
                        .apply();
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void bioAuth(final String title, final String reqId) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        BiometricPrompt.PromptInfo info = new BiometricPrompt.PromptInfo.Builder()
                                .setTitle(title == null || title.length() == 0 ? "Unlock" : title)
                                .setNegativeButtonText("Use passcode")
                                .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_WEAK)
                                .build();
                        BiometricPrompt prompt = new BiometricPrompt((FragmentActivity) MainActivity.this,
                                ContextCompat.getMainExecutor(MainActivity.this),
                                new BiometricPrompt.AuthenticationCallback() {
                                    @Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult r) {
                                        String s = readSecret();
                                        reply(reqId, s != null, s);
                                    }
                                    @Override public void onAuthenticationError(int code, CharSequence msg) {
                                        reply(reqId, false, null);
                                    }
                                });
                        prompt.authenticate(info);
                    } catch (Exception e) {
                        reply(reqId, false, null);
                    }
                }
            });
        }

        @JavascriptInterface
        public void bioClear() {
            try {
                getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().apply();
                KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
                ks.load(null);
                if (ks.containsAlias(KEY_ALIAS)) ks.deleteEntry(KEY_ALIAS);
            } catch (Exception ignored) { }
        }
    }
}
