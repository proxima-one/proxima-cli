import {expect, test} from '@oclif/test'

/*
Should test:
  - Cannot initialize twice (Error message)

  - Does write the package correctly
  - Does write the config correctly
  - Does write the directories (src, test)


*/


describe('init', () => {
  test
    .stdout()
    .command(['init'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })


  test
    .stdout()
    .command(['hello', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
