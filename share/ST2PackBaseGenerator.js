const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class ST2PackBaseGenerator extends Generator {
    helper() {
      console.log('methods on the parent generator won\'t be called automatically');
    }
  
    generateDoc(pkgConfig){
      //Generate README.md
      let templatePath =  path.join( this.templatePath("../../../share/templates/README.md"));
      this.log("template path:" + templatePath);
      this.fs.copyTpl(
        templatePath,
        this.destinationPath("./README.md"),
        pkgConfig
      );
    }
  }