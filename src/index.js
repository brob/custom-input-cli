#! /usr/bin/env node

var inquirer = require('inquirer');
const fse = require('fs-extra')
const fs = require('fs')

const ObjectTemplate = require('../templates/CustomObject')
const StringTemplate = require('../templates/CustomString')

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
  ])
  .then(answers => {
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
    
    // const templateString = renderTemplate(template, {name: inputName})
    fse.outputFile(path, template, (err)=>{
      console.log('written?',err)
    })
      
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