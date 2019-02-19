'use strict';
const ST2PackBaseGenerator = require('../../share/ST2PackBaseGenerator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config');
const YAML = require('yaml');

module.exports = class extends ST2PackBaseGenerator {
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
    this.pkg = { "name": "Hello Wrold" }
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
      this.includeSensors = hasFeature('Sensors');
      this.includeRules = hasFeature('Rules');
      this.includePolicies = hasFeature('Policies');
      this.includeAliases = hasFeature('Aliases');
      this.pack = {
        ref: answers.pack_ref,
        name: answers.pack_name,
        description: answers.pack_desc
      }
    });
  }

  configuring() {
    this.log('pack', this.pack);
  }

  writing() {
    const templateData = {
      appname: this.appname,
      date: new Date().toISOString().split('T')[0],
      pack: this.pack,
      testFramework: this.options['test-framework']
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
      if (
        (file.role === "sensor" && this.includeSensors)
        ||
        (file.role === "rule" && this.includeRules)
        ||
        (file.role === "policy" && this.includePolicies)
        ||
        (file.role === "alias" && this.includeAliases)
        ||
        (file.role === "action" || file.role === "meta")
      ) {
        copyTpl(file.input, file.output, templateData);
      }
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      if (file.input === "pack_config.yaml.example") {
        copy(file.input, templateData.pack.ref + ".yaml.example");
      } else {
        copy(file.input, file.output);
      }
    });

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });

  }

  install() {

    this.config.set('actions', {});
    this.config.set('aliases', {});
    this.config.set('rules', {});
    this.config.set('sensors', {});
    this.config.set('policies', {});
    this.config.set('pack', this.pack);

    config.filesToRender.forEach((fle) => {
      switch (fle.role) {
        case "action":
          if (fle.output.includes(".yaml") && this.includeActions) {
            let readFleObj = YAML.parse(this.fs.read(fle.output));
            let actions = this.config.get('actions');
            actions[readFleObj['name']] = readFleObj;
            this.config.set("actions", actions);
          }
          break;
        case "alias":
          if (fle.output.includes(".yaml") && this.includeAliases) {
            let readFleObj = YAML.parse(this.fs.read(fle.output));
            let aliases = this.config.get('aliases');
            aliases[readFleObj['name']] = readFleObj;
            this.config.set("aliases", aliases);
          }
          break;
        case "rule":
          if (fle.output.includes(".yaml") && this.includeRules) {
            let readFleObj = YAML.parse(this.fs.read(fle.output));
            let rules = this.config.get('rules');
            rules[readFleObj['name']] = readFleObj;
            this.config.set("rules", rules);
          }
          break;
        case "sensor":
          if (fle.output.includes(".yaml") && this.includeSensors) {
            let readFleObj = YAML.parse(this.fs.read(fle.output));
            let sensors = this.config.get('sensors');
            sensors[readFleObj['class_name']] = readFleObj;
            this.config.set("sensors", sensors);
          }
          break;
        case "policy":
          if (fle.output.includes(".yaml") && this.includePolicies) {
            let readFleObj = YAML.parse(this.fs.read(fle.output));
            let policies = this.config.get('policies');
            policies[readFleObj['name']] = readFleObj;
            this.config.set("policies", policies);
          }
          break;
        default:
          ;
      }
    })
    this.config.save();

    if (!this.options['skip-readme']) {
      this.generateDoc(this.config.getAll());
    }
  }

  end() {

    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['add', './']);
    this.spawnCommandSync('git', ['commit', '-m', 'Initial commit']);

    //Output message
    this.log("You are ready to install pack:");
    this.log(" > st2 pack install file:///$PWD");
  }

};