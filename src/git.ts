var exec = require('child_process').exec;

export default function getCurrentBranch(directory, callback) {
    const cmd = 'git rev-parse --abbrev-ref HEAD';
    exec(cmd, { cwd: directory }, function (err, stdout, stderr) {
        let branchName = stdout.split('\n').join('');
        callback(branchName);
    });
}