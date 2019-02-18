'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
  }

  initializing() {
    this.pack = {
        "name": "hello_st2",
        "ref": "hello_st2"
    };
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay(
          "'Allo 'allo! Out of the box I include Stackstorm Hello Pack Boilerplate to build your own stacktorm pack(extension)."
        )
      );
    }

    return this.prompt(config.prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.includes(feat);

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSensors = hasFeature('includeSensors');
      this.includeRules = hasFeature('includeRules');
      this.includePolicies = hasFeature('includePolicies');
      this.includeAliases = answers.includeAliases;
      this.pack.ref = answers.pack_ref;
      this.pack.name = answers.pack_name;
      this.pack.description = answers.pack_desc;
    });
  }

  configuring() {
    this.config.set('pack_name', this.pack.name);
    this.config.set('pack_ref', this.pack.ref);
    this.config.set('pack_ref', this.pack.description);
    this.config.save()
  }

  writing() {
    const templateData = {
      appname: this.appname,
      date: new Date().toISOString().split('T')[0],
      name: this.pack.name,
      ref: this.pack.ref,
      description: this.pack.description,
      testFramework: this.options['test-framework'],
      includeAliases: this.includeAliases,
      includePolicies: this.includePolicies
    };

    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output));
    };

    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(
        this.templatePath(input),
        this.destinationPath(output),
        data
      );
    };

    // Render Files
    config.filesToRender.forEach(file => {
      copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      if( file.input === "pack_config.yaml.example"){
        copy( file.input, templateData.ref + ".yaml.example");
      }else {
        copy(file.input, file.output);
      }
    });

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });

  }
  
};