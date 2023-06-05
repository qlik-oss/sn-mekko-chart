# Releasing

A release consists of the following:

- Bumping the package version based on your commits
- Updating the specification
- Creating a new commit with the changed files
- Creating a tag with the new version
- Pushing the release commit and tag to master

## Step-By-Step

1. On master branch run `git clean -dfx && yarn` to make sure depenencies are up-to-date
2. Run `npm version [major | minor | patch] -m "chore(release): v%s"`. Use semver string based on conventional commits since last release. Ex: `npm version patch -m "chore(release): v%s"`
3. Run `git push && git push --tags` to push commit and tag.

> **_NOTE:_** You should not publish manually to npm. As it will be done in CI.

### On version command failure

1. Run `git tag` to make sure a tag not was created.
2. If a tag was created, delete it with `git tag -d <tag>`
