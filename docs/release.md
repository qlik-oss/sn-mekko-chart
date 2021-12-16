# Releasing

A release will do the following:

* Bump the package version based on your commits
* Generate a CHANGELOG.md
* Create a new commit with the changed files
* Create a tag with the new version

## Step-by-step

1. Make your current branch is master and is up-to-date
2. Run `yarn release`
3. Run `git push --follow-tags origin master && npm publish`

### On release command failure

1. Run `git tag` to make sure no tag was created.
2. If a tag was created, delete it with `git tag -d <tag>`
