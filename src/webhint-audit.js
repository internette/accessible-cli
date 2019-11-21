const dotenv = require('dotenv');

const { Analyzer } = require('hint');

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
    return (args) => {
        const { url, config, envPath, reportsFolder } = args;
        hintrc.hints = require(config).webhint;
        const env = dotenv.config({ path: envPath }).parsed;
        if(env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET && env.CLOUDINARY_CLOUD_NAME){
            hintrc.hints["image-optimization-cloudinary"] = [
                "error", {
                    "apiKey": env.CLOUDINARY_API_KEY,
                    "apiSecret": env.CLOUDINARY_API_SECRET,
                    "cloudName": env.CLOUDINARY_CLOUD_NAME
                }
            ]
        }
        const webhint = Analyzer.create(hintrc);
        return webhint.analyze(url).then(response=> {
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