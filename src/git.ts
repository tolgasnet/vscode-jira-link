var proc = require('child_process');

export function getCurrentBranch(directory, callback) {
    const cmd = 'git rev-parse --abbrev-ref HEAD';
    const execDone = (err, stdout, stderr) => {
        let branchName = stdout.split('\n').join('');
        callback(branchName);
    };
    proc.exec(cmd, { cwd: directory }, execDone);
}