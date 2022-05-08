import sys


class LogurLogger(object):
    def __init__(self, logger) -> None:
        self.logger = logger
        self.logger.remove(0)
        self.logger.add("./config/UserAuth.log", format=self.default_formatter, colorize=False, rotation="10 MB")
        self.logger.add(sys.stderr, format=self.default_formatter,colorize=True)


    def rainbow(self, text):
        colors = ["red", "yellow", "green", "cyan", "blue", "magenta"]
        chars = ("<{}>{}</>".format(colors[i % len(colors)], c) for i, c in enumerate(text.split()))
        return " ".join(chars)

    def default_formatter(self, record):
        rainbow_message = self.rainbow(record["message"])
        # Prevent '{}' in message (if any) to be incorrectly parsed during formatting
        escaped = rainbow_message.replace("{", "{{").replace("}", "}}")
        return "<blue>{time}</blue> | <green>{level}</green> | {extra[ip]} | {extra[username]} | " + escaped + "\n{exception}"

    
    def getlogger(self):
        return self.logger


