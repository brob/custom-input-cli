#! /usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs')

const ObjectTemplate = require('../templates/CustomObject')
const StringTemplate = require('../templates/CustomString')

function fileCheck(answers) {
  const path = `${process.cwd()}/${answers.dir}/${answers.inputName}.js`
    if (fs.existsSync(path)) return true
    return false
}
function buildFile(answers) {
  const {type, inputName, dir} = answers;
  const path = `${process.cwd()}/${dir}/${inputName}.js`
  let template
      if (type == 'stringInput') {
        template = StringTemplate({name: inputName}).toString()
      } else if (type == 'objectInput') {
        template = ObjectTemplate({name: inputName})
      }
  
      fs.access(dir, function(error) {
        if (error) {
          fs.mkdir(dir, (err) => {
            if (err) throw err;
          })
        } else {
          return
        }
      })

}

inquirer
  .prompt([
    {
      type: 'list',
      message: 'Custom Input type',
      name: 'type',
      choices: [
        {
          name: 'String input',
          value: 'stringInput',
        },
        {
          name: 'Object input',
          value: 'objectInput'
        }
      ],
    },
    {
      type: 'input',
      name: 'dir',
      message: 'Which directory are your components?'
    },
    {
      type: 'input',
      name: 'inputName',
      message: "What should we call your input component? (example: MyComponentName, CustomString)",
    },
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'Would you like to override this file?',
      when: fileCheck
    }
  ])
  .then(answers => {
    if (answers.overwrite == undefined || answers.overwrite == true) return buildFile(answers)  
    console.log('Bye!')
          
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log(error)
    } else {
      // Something else went wrong
      console.log(error)

    }
  });