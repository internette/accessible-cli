const dotenv = require('dotenv');

const hintrc = {
    connector: {
        name: "puppeteer",
        options: {
            browser: "Chrome",
            headless: true
        }
    },
    formatters: [
        "json"
    ],
    hints: {}
}

function analyzeUrl(){
    const { Analyzer } = require('hint');
    return (args) => {
        const { url, config, envPath } = args;
        // Create hintrc required for webhint
        hintrc.hints = require(config).webhint;
        const env = dotenv.config({ path: envPath }).parsed;
        // add Image Optimization if Cloudinary keys set
        if(env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET && env.CLOUDINARY_CLOUD_NAME){
            hintrc.hints["image-optimization-cloudinary"] = [
                "error", {
                    "apiKey": env.CLOUDINARY_API_KEY,
                    "apiSecret": env.CLOUDINARY_API_SECRET,
                    "cloudName": env.CLOUDINARY_CLOUD_NAME
                }
            ]
        }
        // Create and run webhint analyzer
        const analyzeMod = Analyzer.create(hintrc);
        return analyzeMod.analyze(url).then(response=> {
            const problems = response[0].problems;
            const formattedProblems = {};
            for(const hint of Object.keys(hintrc.hints)){
                const filterProblems = problems.filter(problem => problem.hintId === hint);
                if(filterProblems.length > 0){
                    formattedProblems[hint] = filterProblems;
                }
            }
            return formattedProblems;
        });
    }
}

module.exports = analyzeUrl;