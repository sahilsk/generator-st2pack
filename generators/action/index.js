'use strict';
const ST2PackBaseGenerator = require('../../share/ST2PackBaseGenerator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config.js');
const YAML = require('yaml');

module.exports = class extends ST2PackBaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.option("skip-readme",{
      desc: 'Skips the generation of README.md file',
      type: Boolean,
      default: false
    });
    this.pack = this.config.get('pack');
  }

  initializing() {
    if (!this.pack) {
      this.pack = {}
    }
  }

  async prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay(
          "'Allo 'allo! I'll help you create a stackstorm action."
        )
      );
    }

    let promptsList = [
      {
        type: "input",
        name: "action_name",
        required: true,
        message: "What's your action name",
        store: true,
      },
      {
        type: "input",
        name: "action_desc",
        message: "What's your action description",
        default: (answers) => this.config.get("actions." + answers.action_name + ".description")
      },
      {
        type: "list",
        name: "runner_type",
        required: true,
        message: "What's your action runner type",
        choices: () => Object.keys(config.runnerList),
        default: (answers) => this.config.get("actions." + answers.action_name + ".runner_type")
      }
    ];

    if (!this.pack.ref) {
      promptsList.push({
        type: "input",
        name: "pack_ref",
        message: "What's your pack name(eg. hello_st2)",
        store: true
      })
    }

    this.answers = await this.prompt(promptsList);

    this.actionMetadata = this.config.get('actions.' + this.answers.action_name)
    if (!this.pack.ref) {
      this.pack.ref = this.answers.pack_ref;
    }

  }

  configuring() {
    this.log("pack ref: ", this.pack.ref);
    this.log("action: ", this.answers.action_name);
    this.config.set("pack", this.pack);
  }

  writing() {
    let actionMetadata = this.actionMetadata;
    actionMetadata = {
      name: this.answers.action_name,
      date: new Date().toISOString().split('T')[0],
      pack: this.pack.ref,
      description: this.answers.action_desc,
      runner_type: this.answers.runner_type,
      enabled: true,
      parameters: {
        action:{
            default: this.answers.action_name,
            immutable: true,
            type: "string"
        }
      }
    };

    let runnerObj = config.runnerList[this.answers.runner_type];
    if (runnerObj.filename != null) {
      actionMetadata.entry_point = runnerObj.filename(actionMetadata.name);
      if (typeof (actionMetadata.entry_point) === "function") {
        actionMetadata.entry_point = actionMetadata.entry_point()
      }
      if (runnerObj.parameters) {
        Object.keys(runnerObj.parameters).forEach(pkey => {
          actionMetadata.parameters[pkey] = runnerObj.parameters[pkey];
        });
      }
      //Create launch script
      this.fs.write("actions/" + actionMetadata.entry_point, runnerObj.text);
    }
    //Create metadata file
    this.fs.write("actions/" + actionMetadata.name + ".yaml", YAML.stringify(actionMetadata));
  }

  install() {
    //Saving action
    let actions = this.config.get('actions');
    if (!actions) {
      actions = {}
    }
    let action_name = this.answers.action_name;
    actions[action_name] = YAML.parse(this.fs.read('./actions/' + action_name + '.yaml'));
    this.config.set('actions', actions);
    this.config.save();

    if (!this.options['skip-readme']) {
      this.generateDoc(this.config.getAll());
    }
  }

  end() {

    //Output message
    this.log("Your action is ready: " + this.answers.action_name);
    this.log("Re-install the pack using following command: ");
    this.log(" > st2 pack install file:///$PWD");
  }

};