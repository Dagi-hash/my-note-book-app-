NOTEBOOK - build your APK with GitHub Actions
=============================================

1. Create a new GitHub repository (private is fine).
2. Unzip this folder, then upload the files into the repo ROOT:
   Add file > Upload files > select index.html, style.css, app.js,
   icon.png, make_icons.py, package.json, capacitor.config.json
   (all of them except build.yml) > Commit.
3. Add the workflow: Add file > Create new file. In the name box type
       .github/workflows/build.yml
   (typing the slashes creates the folders for you), paste the full
   contents of build.yml from this zip, then Commit.
4. Open the Actions tab. The build starts by itself (or press
   "Run workflow"). It takes about 5-8 minutes.
5. When it turns green, open the run and download "Notebook-APK"
   at the bottom (Artifacts). Unzip it to get Notebook.apk,
   copy it to your phone and install it
   (allow "Install unknown apps" when asked).

Change colors / app name:
  - Colors live in the PAL list at the top of app.js.
  - App name and id: capacitor.config.json.
  - App icon: replace icon.png (512x512 square).
