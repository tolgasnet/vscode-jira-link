var exec = require('child_process').exec;

export class Git {
    public getCurrentBranch(directory: string, callback: (branchName) => void) {
        const cmd = 'git rev-parse --abbrev-ref HEAD';
        exec(cmd, { cwd: directory }, function (err, stdout, stderr) {
            callback(stdout.split('\n').join(''))
        })
      }
}