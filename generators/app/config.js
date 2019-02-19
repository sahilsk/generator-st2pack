module.exports = {
    options: {
      'skip-welcome-message': {
        desc: 'Skips the welcome message',
        type: Boolean,
        default: false
      },
      'skip-readme': {
        desc: 'Skips the generation of README.md file',
        type: Boolean,
        default: false
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
            value: 'Sensors',
            checked: true
          },
          {
            name: 'Rules',
            value: 'Rules',
            checked: true
          },
          {
            name: 'Policies',
            value: 'Policies',
            checked: true
          },
          {
            name: 'Aliases',
            value: 'Aliases',
            checked: true
          }
        ],
        store: true
      },
      {
        type: 'input',
        name: 'pack_ref',
        message: 'package ref(without spaces and hyphens eg. hello_st2)',
        default: "hello_st2",
        required: true,
        store: true
      },
      {
        type: 'input',
        name: 'pack_name',
        required: true,
        message: 'package name. eg. hello stackstorm',
        default: answers => answers.pack_ref,
        store: true
      },
      {
        type: 'input',
        name: 'pack_desc',
        message: 'pack descrition goes here',
        default: answers =>  "Stackstorm pack(" + answers.pack_name + ") containing examples of sensor, rule, and action. ",
        store: true
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
        input: 'config.schema.yaml',
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
        output: 'actions/greet.yaml',
        role: "action"
      },
      {
        input: 'actions/greet.sh',
        output: 'actions/greet.sh',
        role: "action"
      },
    //Aliases
      {
        input: 'aliases/alias1.yaml',
        output: 'aliases/alias1.yaml',
        role: "alias"
      },
    //Policies      
      {
        input: 'policies/retry_core_http_on_timeout.yaml',
        output: 'policies/retry_core_http_on_timeout.yaml',
        role: "policy"
      },
      {
        input: 'policies/policy1.yaml',
        output: 'policies/policy1.yaml',
        role: "policy"
      },
    //Rules
      {
        input: 'rules/rule1.yaml',
        output: 'rules/rule1.yaml',
        role: "rule"
      },    
    //Sensors
      {
        input: 'sensors/sensor1.py',
        output: 'sensors/sensor1.py',
        role: "sensor"
      },    
      {
        input: 'sensors/sensor1.yaml',
        output: 'sensors/sensor1.yaml',
        role: "sensor"
      },    
    //Pack.yaml
      {
        input: 'pack.yaml',
        output: 'pack.yaml',
        role: "meta"
      }
    ]
  };