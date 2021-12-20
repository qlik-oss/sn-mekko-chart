# Releasing

A release consists of the following:

* Bumping the package version based on your commits
* Generating a CHANGELOG.md
* Updating the specification
* Creating a new commit with the changed files
* Creating a tag with the new version
* Pushing the release commit and tag to master

## Step-By-Step

1. Make sure your current branch is master and is up to date
2. Run `yarn release`
3. Verify that everything looks good
4. Push the commit and tag `git push --follow-tags origin master`

> **_NOTE:_** You should not publish manually to npm. As it will be done in CI.

### On release command failure

1. Run `git tag` to make sure a tag not was created.
2. If a tag was created, delete it with `git tag -d <tag>`
