import { afterEach, describe, expect, it } from "bun:test";
import { resetSettingsForTest, Settings } from "@oh-my-pi/pi-coding-agent/config/settings";
import {
	buildTuiBuiltinSlashCommands,
	getBuiltinSlashCommandReservedNames,
	lookupBuiltinSlashCommand,
} from "@oh-my-pi/pi-coding-agent/slash-commands/builtin-registry";
import type { TuiSlashCommandRuntime } from "@oh-my-pi/pi-coding-agent/slash-commands/types";

const runtime = { ctx: {} } as TuiSlashCommandRuntime;

describe("builtin /commit availability", () => {
	afterEach(() => {
		resetSettingsForTest();
	});

	it("is hidden and does not reserve its name when commit.enabled is false", async () => {
		await Settings.init({ inMemory: true, overrides: { "commit.enabled": false } });

		expect(lookupBuiltinSlashCommand("commit")).toBeUndefined();
		expect(getBuiltinSlashCommandReservedNames().has("commit")).toBe(false);
		expect(buildTuiBuiltinSlashCommands(runtime).some(cmd => cmd.name === "commit")).toBe(false);
	});

	it("is listed, dispatchable and reserved when commit.enabled is true", async () => {
		await Settings.init({ inMemory: true, overrides: { "commit.enabled": true } });

		expect(lookupBuiltinSlashCommand("commit")?.name).toBe("commit");
		expect(getBuiltinSlashCommandReservedNames().has("commit")).toBe(true);
		expect(buildTuiBuiltinSlashCommands(runtime).some(cmd => cmd.name === "commit")).toBe(true);
	});
});
