const fs = require('fs');
const path = require('path');

/**
 * Writes structured failure logs after each test run.
 * Outputs: Reports/failure-logs/failures.log + failures.json
 */
class FailureLogReporter {
  constructor(options = {}) {
    this.outputDir =
      options.outputDir || path.join(process.cwd(), 'Reports', 'failure-logs');
    this.failures = [];
  }

  onTestEnd(test, result) {
    if (result.status === 'passed' || result.status === 'skipped') {
      return;
    }

    const projectName = test.parent?.project?.()?.name ?? 'default';
    const suiteChain = [];
    let parent = test.parent;
    while (parent && parent.title) {
      suiteChain.unshift(parent.title);
      parent = parent.parent;
    }

    this.failures.push({
      timestamp: new Date().toISOString(),
      project: projectName,
      suite: suiteChain.join(' > '),
      title: test.title,
      status: result.status,
      durationMs: result.duration,
      errors: result.errors?.map((error) => ({
        message: error.message,
        stack: error.stack,
      })),
      attachments: result.attachments?.map((attachment) => ({
        name: attachment.name,
        contentType: attachment.contentType,
        path: attachment.path,
      })),
    });
  }

  onEnd(result) {
    fs.mkdirSync(this.outputDir, { recursive: true });

    const logPath = path.join(this.outputDir, 'failures.log');
    const jsonPath = path.join(this.outputDir, 'failures.json');

    const logLines =
      this.failures.length > 0
        ? this.failures.map((failure) => {
            const errorText =
              failure.errors?.map((error) => error.message).join('\n') ?? 'No error message';
            const attachmentText = failure.attachments?.length
              ? `Attachments: ${failure.attachments
                  .map((attachment) => attachment.path || attachment.name)
                  .join(', ')}`
              : '';

            return [
              `[${failure.timestamp}] ${failure.project}`,
              `Suite: ${failure.suite}`,
              `Test: ${failure.title}`,
              `Status: ${failure.status} (${failure.durationMs}ms)`,
              errorText,
              attachmentText,
              '---',
            ]
              .filter(Boolean)
              .join('\n');
          })
        : ['No test failures in this run.'];

    fs.writeFileSync(logPath, `${logLines.join('\n\n')}\n`);
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          suiteStatus: result.status,
          totalFailures: this.failures.length,
          failures: this.failures,
        },
        null,
        2
      )
    );
  }

  printsToStdio() {
    return false;
  }
}

module.exports = FailureLogReporter;
