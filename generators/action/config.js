module.exports = {

    //Available runners list: https://docs.stackstorm.com/actions.html#available-runners
    runnerList: {
        'local-shell-cmd': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'local-shell-script': {
            "text": '\
#!/bin/bash\n\
echo "$1, StackStorm!"\n\
',
            'filename': action_name => action_name + '.sh',
            "parameters": {
                "greeting": {
                    "type": "string",
                    "description": " Greeting you want to say to StackStorm (i.e. Hello, Hi, Yo, etc.)",
                    "required": true,
                    "position": 1
                }
            }
        },
        'remote-shell-cmd': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'remote-shell-script': {
            "text": '\
#!/bin/bash\n\
echo "$1, StackStorm!"\n\
',
            'filename': action_name => action_name + '.sh',
            "parameters": {
                "greeting": {
                    "type": "string",
                    "description": " Greeting you want to say to StackStorm (i.e. Hello, Hi, Yo, etc.)",
                    "required": true,
                    "position": 1
                }
            }
        },
        'windows-cmd': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'windows-script': {
            "text": '',
            'filename': action_name => action_name + '.ps1',
            "parameters": {}
        },
        'winrm-cmd': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'winrm-ps-cmd': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'winrm-ps-script': {
            "text": '',
            'filename': action_name => action_name + '.ps1',
            "parameters": {}
        },
        'http-request': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'python-script': {
            "text": "\
import sys\n\
\n\
from st2common.runners.base_action import Action\n\
\n\
class MyEchoAction(Action):\n\
    def run(self, message):\n\
        print(message)\n\
\n\
        if message == 'working':\n\
            return (True, message)\n\
        return (False, message)\n\
            ",
            'filename': action_name => action_name + '.py',
            "parameters": {
                "message": {
                    "type": "string",
                    "description": "Message to print.",
                    "required": true,
                    "position": 0
                }
            }

        },
        'action-chain': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'mistral-v2': {
            "text": '',
            'filename': null,
            "parameters": {}
        },
        'cloudslang': {
            "text": '',
            'filename': null
        }
    }

}