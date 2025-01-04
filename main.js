define(function (require, exports, module) {
    "use strict";

    const AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus");

    const COMMAND_ID = "myTerminal.toggle";

    // Initialize terminal functionality
    function initTerminal() {
        const terminal = document.getElementById("my-terminal");
        const outputElement = document.getElementById("terminal-output");
        const inputElement = document.getElementById("terminal-input");

        const commands = {
            clear: () => {
                outputElement.innerHTML = "";
            },
            help: () => {
                return "Available commands: clear, help, echo [message]";
            },
            echo: (args) => {
                return args.join(" ");
            },
        };

        function appendOutput(content, isError = false) {
            const line = document.createElement("div");
            line.textContent = content;
            line.style.color = isError ? "red" : "inherit";
            outputElement.appendChild(line);
            outputElement.scrollTop = outputElement.scrollHeight;
        }

        inputElement.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const input = inputElement.value.trim();
                inputElement.value = "";

                appendOutput(`> ${input}`);

                if (!input) return;

                const [command, ...args] = input.split(" ");

                if (commands[command]) {
                    try {
                        const result = commands[command](args);
                        if (result) appendOutput(result);
                    } catch (err) {
                        appendOutput(`Error: ${err.message}`, true);
                    }
                } else {
                    appendOutput(`Unknown command: ${command}`, true);
                }
            }
        });
    }

    // Register menu command
    CommandManager.register("Toggle Terminal", COMMAND_ID, () => {
        const terminal = document.getElementById("my-terminal");
        terminal.style.display = terminal.style.display === "none" ? "block" : "none";
    });

    const menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(COMMAND_ID);

    AppInit.appReady(() => {
        require(["text!path/to/terminal.html", "text!path/to/main.css"], (html, css) => {
            $("body").append(html);
            $("<style>").text(css).appendTo("head");
            initTerminal();
        });
    });
});
