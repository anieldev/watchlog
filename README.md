# Watchlog

A static personal media archive built with HTML, CSS, and JavaScript.

## Local Preview

Open `index.html` in a browser, or serve the directory with any static file server.

## Deploy To GitHub Pages

1. Create a GitHub repository, such as `watchlog`.
2. Push this repository to GitHub.
3. In the GitHub repository, open **Settings** > **Pages**.
4. Set **Build and deployment** to **Deploy from a branch**.
5. Select branch `main` and folder `/root`.
6. Save and wait for GitHub Pages to publish.

The default project URL will be:

```text
https://YOUR-USERNAME.github.io/REPOSITORY-NAME/
```

## Custom Domain

In **Settings** > **Pages**, add the custom domain first. Then configure DNS at your registrar.

For an apex domain:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

For `www`:

```text
www  CNAME  YOUR-USERNAME.github.io
```

After DNS resolves, enable **Enforce HTTPS** in GitHub Pages.
