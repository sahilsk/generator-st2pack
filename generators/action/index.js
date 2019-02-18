'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config.js');
const YAML = require('yaml');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

  }

  initializing() {
    this.pack = {
      "name": this.config.get('pack_name', null),
      "ref": this.config.get('pack_ref', null)
    };
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
        message: "What's your action name",
        store: true
      },
      {
        type: "input",
        name: "action_desc",
        message: "What's your action description",
        default: "action description goes here",
        store: true
      },
      {
        type: "list",
        name: "runner_type",
        message: "What's your action runner type",
        choices: () => Object.keys(config.entrypointMap),
        store: true
      }
    ];

    if( !this.pack.ref){
      promptsList.push({
        type: "input",
        name: "pack_ref",
        message: "What's your pack name(eg. hello_st2)",
        store: true
      })
    }
    this.answers = await this.prompt(promptsList);
    
    if( !this.pack.ref){
      this.pack.ref = this.answers.pack_ref;
    }

    this.answers.entrypoint = config.entrypointMap[this.answers.runner_type]
    
    this.log("action name", this.answers.action_name);
    this.log("action desc", this.answers.action_desc);
    this.log("runner type", this.answers.runner_type);
    this.log("entrypoint", this.answers.entrypoint);
    this.log("pack_ref", this.answers.pack_ref);

  }

  configuring() {
    this.log("pack ref", this.pack.ref);
  }

  writing() {

    const templateData = {
      name: this.answers.action_name,
      date: new Date().toISOString().split('T')[0],
      pack: this.pack.ref,
      description: this.answers.action_desc,
      runner_type: this.answers.runner_type,
      enabled: true
    };

    //create action metafile here

    let actionMetafile = templateData;
    actionMetafile.name = templateData.name;
    actionMetafile.pack = templateData.pack;
    actionMetafile.runner_type = templateData.runner_type;
    actionMetafile.description = templateData.description;


    if (this.answers.entrypoint.filename != null) {
      let entry_file = this.answers.entrypoint.filename(actionMetafile.name);
      actionMetafile.entry_point = entry_file;
      actionMetafile.parameters = this.answers.entrypoint.parameters;
      this.fs.write("actions/" + entry_file, this.answers.entrypoint.text);
    }

    this.fs.write("actions/" + actionMetafile.name + ".yaml", YAML.stringify(actionMetafile));
  }


};