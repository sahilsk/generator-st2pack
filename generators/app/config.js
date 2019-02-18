module.exports = {
    options: {
      'skip-welcome-message': {
        desc: 'Skips the welcome message',
        type: Boolean
      },
      'skip-install-message': {
        desc: 'Skips the message after the installation of dependencies',
        type: Boolean
      }
    },
    prompts: [
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features would you like to include?',
        choices: [
          {
            name: 'Sensors',
            value: 'includeSensors',
            checked: true
          },
          {
            name: 'Rules',
            value: 'includeRules',
            checked: true
          },
          {
            name: 'Policies',
            value: 'includePolicies',
            checked: true
          },
          {
            name: 'Aliases',
            value: 'includeAliases',
            checked: true
          }
        ]
      },
      {
        type: 'input',
        name: 'pack_ref',
        message: 'package ref(without spaces and hyphens eg. hello_st2)',
        default: "hello_st2"
      },
      {
        type: 'input',
        name: 'pack_name',
        message: 'package name. eg. hello stackstorm',
        default: answers => answers.pack_ref
      },
      {
        type: 'input',
        name: 'pack_desc',
        message: 'pack descrition goes here',
        default: answers =>  "Stackstorm pack(" + answers.pack_name + ") containing examples of sensor, rule, and action. "
      }
    ],
    dirsToCreate: [],
    filesToCopy: [
      {
        input: 'gitignore',
        output: '.gitignore'
      },
      {
        input: 'icon.png',
        output: 'icon.png'
      },
      {
        input: 'requirements.txt',
        output: 'requirements.txt'
      },
      {
        input: 'pack_config.schema.yaml',
        output: 'config.schema.yaml'
      },
      {
        input: 'pack_config.yaml.example',
        output: 'packname.yaml.example'
      }
    ],
    filesToRender: [
    //Actions
      {
        input: 'actions/greet.yaml',
        output: 'actions/greet.yaml'
      },
      {
        input: 'actions/greet.sh',
        output: 'actions/greet.sh'
      },
    //Aliases
      {
        input: 'aliases/alias1.yaml',
        output: 'aliases/alias1.yaml'
      },
    //Policies      
      {
        input: 'policies/retry_core_http_on_timeout.yaml',
        output: 'policies/retry_core_http_on_timeout.yaml'
      },
      {
        input: 'policies/policy1.yaml',
        output: 'policies/policy1.yaml'
      },
    //Rules
      {
        input: 'rules/rule1.yaml',
        output: 'rules/rule1.yaml'
      },    
    //Sensors
      {
        input: 'sensors/sensor1.py',
        output: 'sensors/sensor1.py'
      },    
      {
        input: 'sensors/sensor1.yaml',
        output: 'sensors/sensor1.yaml'
      },    
    //Pack.yaml
      {
        input: 'pack.yaml',
        output: 'pack.yaml'
      },
    //README.md
      {
        input: 'README.md',
        output: 'README.md'
      }
    ]
  };