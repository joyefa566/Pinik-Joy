const config = {
    name: "help",
    aliases: ["cmds", "commands"],
    description: "Show all commands or command details",
    usage: "[command] (optional)",
    credits: "XaviaTeam"
}


const langData = {
    "en_US": {
        "help.list": "{list}\n\n⇒ Total: {total} commands\n⇒ Use {syntax} [command] to get more information about a command.",
        "help.commandNotExists": "Command {command} does not exists.",
        "help.commandDetails": `
            ⇒ Name: {name}
            ⇒ Aliases: {aliases}
            ⇒ Description: {description}
            ⇒ Usage: {usage}
            ⇒ Permissions: {permissions}
            ⇒ Category: {category}
            ⇒ Cooldown: {cooldown}
            ⇒ Credits: {credits}
        `,
        "0": "Member",
        "1": "Group Admin",
        "2": "Bot Admin"
    },
    "vi_VN": {
        "help.list": "{list}\n\n⇒ Tổng cộng: {total} lệnh\n⇒ Sử dụng {syntax} [lệnh] để xem thêm thông tin về lệnh.",
        "help.commandNotExists": "Lệnh {command} không tồn tại.",
        "help.commandDetails": `
            ⇒ Tên: {name}
            ⇒ Tên khác: {aliases}
            ⇒ Mô tả: {description}
            ⇒ Cách sử dụng: {usage}
            ⇒ Quyền hạn: {permissions}
            ⇒ Thể loại: {category}
            ⇒ Thời gian chờ: {cooldown}
            ⇒ Người viết: {credits}
        `,
        "0": "Thành viên",
        "1": "Quản trị nhóm",
        "2": "Quản trị bot"
    }
}

async function onCall({ message, args, getLang, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        for (const [key, value] of commandsConfig.entries()) {
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = [];
            commands[value.category].push(key);
        }

        let list = Object.keys(commands)
            .map(category => `⌈ ${category.toUpperCase()} ⌋\n${commands[category].join(", ")}`)
            .join("\n\n");

        message.reply(getLang("help.list", {
            total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
            list,
            syntax: message.args[0].toLowerCase()
        }));
    } else {
        if (!commandsConfig.has(commandName)) return message.reply(getLang("help.commandNotExists", { command: commandName }));
        const command = commandsConfig.get(commandName);

        message.reply(getLang("help.commandDetails", {
            name: command.name,
            aliases: command.aliases.join(", "),
            description: command.description || '',
            usage: `${prefix}${command.name} ${command.usage || ''}`,
            permissions: command.permissions.map(p => getLang(p)).join(", "),
            category: command.category,
            cooldown: command.cooldown || 3,
            credits: command.credits || ""
        }).replace(/^ +/gm, ''));
    }
}

export default {
    config,
    langData,
    onCall
}
