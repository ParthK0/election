$git = "C:\Program Files\Git\cmd\git.exe"
& $git rm -r coverage
& $git add .github/ firestore.rules firestore.indexes.json functions/ firebase.json
& $git commit -m "chore: configure security rules, firebase functions, and github actions pipeline"

& $git add package.json package-lock.json server.js eslint.config.js vite.config.js playwright.config.js .npmrc
& $git commit -m "build: enforce strict dependencies, linting, and server-side zod validation"

& $git add src/lib/firebase.js src/main.jsx src/App.jsx src/context/ src/api/
& $git commit -m "feat: integrate core firebase services (analytics, app check, performance)"

& $git add src/components/
& $git commit -m "feat(ui): implement accessible navigation, focused menus, and updated components"

& $git add .
& $git commit -m "test: scaffold e2e workflows and complete final evaluation optimizations"

& $git push
