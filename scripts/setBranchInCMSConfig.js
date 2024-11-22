import { execSync } from 'child_process';
import fs from 'fs';

const CONFIG_PATH = 'static/admin/config.yml';

// Get current git branch considering both local and Netlify environments
function getCurrentBranch() {
    // First check for Netlify's BRANCH environment variable
    if (process.env.BRANCH) {
        console.log('Using Netlify branch:', process.env.BRANCH);
        return process.env.BRANCH;
    }

    // Fallback to git command for local development
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD')
            .toString()
            .trim();
        console.log('Using local git branch:', branch);
        return branch;
    } catch (error) {
        console.error('Error getting git branch:', error);
        return 'main'; // Fallback to main if there's an error
    }
}

// Replace CURRENT_BRANCH in config file
function updateConfig() {
    try {
        const currentBranch = getCurrentBranch();
        const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
        const updatedContent = configContent.replace(/CURRENT_BRANCH/g, currentBranch);
        
        fs.writeFileSync(CONFIG_PATH, updatedContent);
        console.log(`Successfully updated branch to: ${currentBranch}`);
    } catch (error) {
        console.error('Error updating config:', error);
        process.exit(1);
    }
}

updateConfig();