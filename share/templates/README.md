# Stackstorm-<%= pack.name %>

<%= pack.description %>

## Installation


Install this pack with: `st2 pack install file:///$PWD`

Or if in remote repository: `st2 pack install https://github.com/MY/PACK`

## Configuration

Copy the example configuration in [<%= pack.ref %>.yaml.example](./<%= pack.ref %>.yaml.example)
to `/opt/stackstorm/configs/<%= pack.ref %>.yaml` and edit as required.

* ``url`` - URL of the pack (e.g. ``https://myproject.abc.net``)
* ``username`` - username
* ``password`` - Password


**Note** : When modifying the configuration in `/opt/stackstorm/configs/` please
           remember to tell StackStorm to load these new values by running
           `st2ctl reload --register-configs`

## Actions

<% Object.keys(actions).forEach(function(key){
    let action =  actions[key];
 %>
* **<%= action.name %>** : <%= action.description %>
    - *runner-type*: <%= action.runner_type %>
    - *enabled*: <%= action.enabled %>
    - *entry_point*: <%= action.entry_point %>
    <% if(action.parameters){
        let paramObj = JSON.stringify(action.parameters, null, 2);
    %>
    - *parameters*:
``` json
<%- paramObj %>
```
    <% } %>
<% }) %>


<% if( promptValues.features.includes("Aliases")){ %>

## Aliases

<% Object.keys(aliases).forEach(function(key){
    let alias =  aliases[key];
 %>
* **<%= alias.name %>** : <%= alias.description %>
<% }) %>

<%}%>

<% if( promptValues.features.includes("Rules")){ %>

## Rules

<% Object.keys(rules).forEach(function(key){
    let rule =  rules[key];
%>

* **<%= rule.name %>** : <%= rule.description %>
<% }) %>

<%}%>

<% if( promptValues.features.includes("Sensors")){ %>

## Sensors

<% Object.keys(sensors).forEach(function(key){
    let sensor =  sensors[key];
%>
* **<%= sensor.class_name %>** : <%= sensor.description %>
<% }) %>

<%}%>

<% if( promptValues.features.includes("Policies")){ %>

## Policies

<% Object.keys(policies).forEach(function(key){
    let policy =  policies[key];
%>
* **<%= policy.name %>** : <%= policy.description %>
<% }) %>

<%}%>