# Accessible: The Accessibility CLI

Welcome to an attempt to make the web more inclusive. Accessible is a CLI aiming to make the web more accessible and performant. The goal: Use prominent accessibility and performance standards tooling in builds, failing when the set goals are not met. Let's see how we do this!

**Table of Contents**

- [The CLI](#accessible-cli)
    - [Create Command](#accessible-create)
    - [Test Command](#accessible-test)
- [Current Users](#accessibility-allstars)


## The CLI<span id="accessible-cli"></span>

Accessible has two commands right out of the box: `accessible create` and `accessible test`.

### Create<span id="accessible-create"></span>
Accessible requires a configuration file (`accessibility-config.json`) and environment file to run tests. We've attempted to make this process as painless as possible with the command `accessible create`. There are three options with this command:
- `--env`: This creates the environment file. This file is necessary for <a href="https://www.npmjs.com/package/webaim-wave" target="_blank">Webaim-wave</a> and access to <a href="https://webhint.io/docs/user-guide/hints/hint-image-optimization-cloudinary/" target="_blank">Webhint's Image Optimization feature</a>. The `.env` file has four values:

    - `API_KEY`: This is your Webaim WAVE API key
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
    - `CLOUDINARY_CLOUD_NAME`
    
- `--config`: Flag used to create the configuration file `accessibility-config.json` at the root of the project. This file must be at the root of the project. Listed below are the seven properties available and the expected value type:
    - `url` [**STRING**]: The URL you want to test

    - `tools` [**ARRAY**]: An array of tests utilities to use. The following options are:

        - `lighthouse`: <a href="https://developers.google.com/web/tools/lighthouse" target="_blank">Google Lighthouse</a>
        - `wave`: <a href="https://wave.webaim.org/help" target="_blank">WebAim Wave</a>
        - `webhint`: <a href="https://webhint.io/docs/user-guide/" target="_blank">Webhint</a>

      Example configuration: `tools: ["lighthouse", "wave"]`
    
    - `envPath` [**STRING**]: The location of the `.env` file used for <a href="https://cloudinary.com/" target="_blank">Cloudinary</a> and <a href="https://wave.webaim.org/api" target="_blank">Wave</a> API keys
    - `outputFolder` [**STRING**]: The location storing the audit output file. The plugin recognizes relative paths `./` and absolute paths `C:\`. 
    - `lighthouse` [**OBJECT**]: An object of Lighthouse tests and the user-determined passable values.
    - `wave` [**OBJECT**]: An object of WAVE tests and the user-determined passable values.
    - `webhint` [**OBJECT**]: An object of Webhint tests and the user-determined passable values.

  To exclude any irrelevant tests, delete them from the object.
- `--all`: This flag creates the `.env` and `accessibility-config.json` file. 

### Test<span id="accessible-test"></span>
Accessible's `accessible test` runs user-designated tests and outputs a JSON file of all failed test. The CLI reads the `accessibility-config.json` file, compares the tooling outputs, and creates a report of the differences.

#### Output
The CLI outputs a file `accessibility.json` with all errors based on the user-dictated tooling to user-specified path `outputFolder` in `accessibility-config.json`.

# People Improving the Web<span id="accessibility-allstars"></span>

This is a list of people and companies using the CLI

## If you use this CLI, please create an issue to this repo with your website. We'd love to celebrate those working to better the web.
