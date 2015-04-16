---
title: Plugins
next: /guide/faq
previous: /guide/publishing
---

# Creating Your First Plugin

You're probably burning with the desire to re-define selection, validation, extraction and conform all in one go, but let's stick with those baby steps and implement just one plugin!

**Table of contents**

- Our plugin, the historian
- A little strategy
- A look at the interface
- Implementation
- We are family
- Adding host support
- Saving your work
- Running your plugin
- Registering your plugin
- Trying that again
- An error we've been waiting forfor)
- Conclusion
- Persistently registering pluginsplugin)
 - Via the environment variable
 - Via configuration

### Our Plugin, the Historian

We'll be continuing our journey from where the previous tutorial left off and validate our cube just a little bit more. This time, we'll make sure that it lives up to those quality standards and that it doesn't have any history left behind from modeling.

### A Little Strategy

Let's take a moment to think about how we want this to go down.

In a nutshell, we want a plugin to look at our cube and determine whether or not it has history attached. We can probably utilise the `maya.cmds` module, but which command specifically?

[`maya.cmds.listHistory()`][listhistory] looks good, let's try that.

```python
>>> history = cmds.listHistory('myCube_GEO')
>>> print history
[u'myCube_GEOShape', u'polyCube1']
```

Hmm, the command does indeed give us the history of our node, but it also returns a shape node. Looks like we'll also need to check for those before making our evaluation.

```python
>>> for node in history:
...    if cmds.nodeType(node) is not "mesh":
...        print "This node has history!"
...        break
```

That should do it. Now we have a way of looking at `myCube_GEO` and determine whether or not it has any history attached. We would like our validator to do the same and prevent users from publishing until the problem has been fixed.

[listhistory]: http://help.autodesk.com/cloudhelp/2015/ENU/Maya-Tech-Docs/CommandsPython/listHistory.html

### A Look At The Interface

Plugins are sub-classed from `Plugin` - a base-class located at `pyblish.api`. `Plugin` is further divided into four sub-classes; Selector, Validator, Extractor and Conform respectively.

To get started, let's create a new module and our own plugin subclass.

```python
# validate_history.py
import pyblish.api

class ValidateHistory(pyblish.api.Validator):
    pass
```

Each plugin carries two methods of interest to us - `process_context` and `process_instance` - processing the context and instance respectively.

As we are interested in processing our instance, which contains `myCube_GEO`, we'll choose an appropriate method to override.

```python
# validate_history.py
import pyblish.api

class ValidateHistory(pyblish.api.Validator):
    def process_instance(self, instance):
        pass
```

Now that we have access to our instance, let's take a moment to talk about what the instance is in terms of Python.

> Technically, Context and Instance are both sub-classes of the Python `list`. As lists, they can be treated as iterables; the context containing one or more instances and an instance containing one or more nodes in your scene.

> ```python
for instance in context:
    for node in instance:
        print "{0} - {1} - {2}".format(context, instance, node)
```

### Implementation

Considering this, we may retrieve `myCube_GEO` by iterating over the `instance` argument of `process_instance()`, and this is where we'll finally apply our validation. Don't forget to import `maya.cmds`.

```python
# Content discarded for brevity
...
    def process_instance(self, instance):
        for node in instance:
            for history in cmds.listHistory(node):
                if cmds.nodeType(history) != "mesh":
                    raise TypeError("%s has incoming history!" % node)
```

At the very end, you can see that we're raising an exception. This is a validator's way of saying that an instance has not passed validation. If a validator doesn't raise an exception, all is considered well and the instance is considered valid. 

The message within the exception is presented to the user, so it's important that it contains what went wrong and what the user can do to remedy the issue.

### We Are Family

Now there is just one thing remaining before this plugin is ready to go. We'll need to associate it with a family.

Remember from our last tutorial that we associated the family "demo.model" to our instance? Well, if we want our custom plugin to operate on this instance we'll need to make it compatible with this family.

```python
...
class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
...
```

> A plugin can support multiple families. 

> This is useful in situations where you may have a more general plugin apply to many types of families. For example, you may want naming convention to apply to both models and rigs.

### Adding Host Support

It is possible for you to have plugins applicable with a variety of hosts, not only for Maya. Some may only be compatible with Nuke, others with Houdini.

To indicate which host a particular plugin is designed for, add a `hosts` attribute to your plugin.

```python
...
class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
    hosts = ['maya']
...
```

The full implementation now looks like this:

```python
import pyblish.api
from maya import cmds


class ValidateHistory(pyblish.api.Validator):
    families = ['demo.model']
    hosts = ['maya']

    def process_instance(self, instance):
        for node in instance:
            for history in cmds.listHistory(node):
                if cmds.nodeType(history) != "mesh":
                    raise TypeError("%s has incoming history!" % node)

```

### Running Your Plugin

Choose a directory to your liking and save your plugin as `validate_history.py`. 

The name is important. Any module starting with `validate_` is considered a validator-plugin. Just as those starting with `select_`, `extract_` and `conform_` are considered a selector-, extractor- and conform-plugin respectively.

> You can change the manner in which plugins are discovered via your user-configuration file. For more information, head on back up to Configuring Pyblish.

For the sake of this tutorial, I'll assume you've saved your plugin here.

```
c:\my_plugins\validate_history.py
```

### Saving Your Work

Open up you scene from the last tutorial and run the following.

```python
import pyblish.api
import pyblish.main

context = pyblish.api.Context()
pyblish.main.select(context)
```

At this point, `myCube_GEO` has been selected and now resides within an instance within the context. Let's run it through validation and see what happens.

```python
pyblish.main.validate(context)
```

Because `myCube_GEO` has history, the `polyCube1` generator, your plugin should have triggered an exception, but didn't. 

Why is that?

### Registering Your Plugin

For Pyblish to pick up your brilliant plugin, we'll first need to tell it about where you put it. You can register a directory in which you keep custom plugins. 

> You could store it along with where the other plugins are at, in the Pyblish Python package. But by doing this you risk loosing your plugins when updating or un-installing Pyblish.

In our case, we wish to register:

```
c:\my_plugins
```

We can do that by adding to following command:

```python
pyblish.api.register_plugin_path(r'c:\my_plugins')
```

### Trying That Again

Our full script now looks like this.

```python
import pyblish.api
import pyblish.main

pyblish.api.register_plugin_path(r'c:\my_plugins')

context = pyblish.api.Context()
pyblish.main.select(context)
pyblish.main.validate(context)
```

By registering our path, we've made Pyblish aware of our custom plugin.

### An Error We've Been Waiting For

If everything went right, we've got our error.

```python
# Error: pyblish.api.Plugin : An exception occured during processing of instance [u'MyCube'] # 
# Error: TypeError: file C:\Python27\Lib\site-packages\pyblish\main.py line 71: |myCube_GEO|myCube_GEOShape has incoming history! # 
```

You'll also see that if you try and publish, the validator will prevent you.

1. In your `File` menu
2. Click `Publish`

Or type the following:

```python
import pyblish.main
pyblish.main.publish_all()
```

The user has now been alerted of the fact that his cube isn't living up to the requirements set forth by us. 

We can remedy this by deleting all history.

1. With `myCube_GEO` selected
1. In your `Edit` menu
1. Click `Delete by Type`
1. Click `History`

Or type the following:

```python
cmds.delete('myCube_GEO', constructionHistory=True)
```

### Conclusion

Now that `myCube_GEO` is up to par with our standards, we can publish it once more!

1. In your `File` menu
2. Click `Publish`

Or type the following:

```python
import pyblish.main
pyblish.main.publish_all()
```

Thanks to your plugin, you can now rest assured that all content of this family in your library are completely free of any history. You can imagine how useful this becomes once your library starts growing. By making a few validators such as the one we just made, we can ensure that no content misbehaves and that all content remains familiar to those who use it. 

This is also an important step in automation within your pipeline. We'll talk more about automation in later tutorials, but for now, let's have a final look at the registration process and what your options are here.

### Persistently Registering Plugins

You may have noticed that adding your custom path from Python isn't always an option. A more fool-proof method may be to store it some place where it will always get picked up. For this, you have a couple of options.

#### Via the Environment Variable

At run-time, Pyblish will be looking within your environment for a variable called `PYBLISHPLUGINPATH`. Instead of registering a path via Python, you can add it to this comma-separated list of paths.

> WARNING: setx is modifying your environment, use with care.

```bash
# On Windows
$ setx PYBLISHPLUGINPATH %PYBLISHPLUGINPATH%;c:\my_plugins
```

For more help with modifying your environment, see [Adding a new environment variable][var]

A benefit of environment variables is that it can be added to your application-launch procedure. For example, whenever you launch Maya, your "boot-strapper" could append plugins relevant to that application (*and current project!*) prior to it being run.

A disadvantage however is that environment variables are local to your machine and may not always be the most maintainable solution.

[var]: https://github.com/abstractfactory/pyblish/wiki/Adding-an-environment-variable

#### Via Configuration

As an alternative, you can specify paths in your configuration file. We haven't yet spoken about configuration and I'll get back to you once we have, but by storing paths via a configuration file, you can make this file shared across workstations and in this way provide for a maintainable method of specifying paths for your organisation.

A disadvantage however is that it is global to all of your applications and can't get distinguished in the same way as environment variables can with each running process.