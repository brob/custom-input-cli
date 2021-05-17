var inquirer = require('inquirer');
const fse = require('fs-extra')
const fs = require('fs')
const Handlebars = require("handlebars");


function renderTemplate(filePath, data) {
  const source = fs.readFileSync(filePath,'utf8')
  const template = Handlebars.compile(source);
  return template(data)
} 

const templates = {
  'stringInput': 'templates/CustomString.js'
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
  ])
  .then(answers => {
    const {type, inputName, dir} = answers;
    const path = `${process.cwd()}/${dir}/${inputName}.js`
    const template = `${process.cwd()}/${templates[type]}`
    fs.access(dir, function(error) {
      if (error) {
        fs.mkdir(dir, (err) => {
          if (err) throw err;
        })
      } else {
        return
      }
    })
    
    const templateString = renderTemplate(template, {name: inputName})
    fse.outputFile(path, templateString, (err)=>{
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