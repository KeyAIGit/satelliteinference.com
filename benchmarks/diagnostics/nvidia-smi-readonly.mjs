import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const NVIDIA_SMI_QUERY_FIELDS = Object.freeze([
  "uuid",
  "name",
  "driver_version",
  "pstate",
  "power.draw",
  "temperature.gpu",
  "memory.total",
  "memory.used",
  "utilization.gpu",
]);

const QUERY_ARGUMENT = `--query-gpu=${NVIDIA_SMI_QUERY_FIELDS.join(",")}`;
const FORMAT_ARGUMENT = "--format=csv,noheader,nounits";

export function buildNvidiaSmiReadOnlyInvocation() {
  return Object.freeze({
    file: "nvidia-smi",
    args: Object.freeze([QUERY_ARGUMENT, FORMAT_ARGUMENT]),
  });
}

export function assertReadOnlyNvidiaSmiInvocation(invocation) {
  if (invocation.file !== "nvidia-smi") throw new TypeError("diagnostic executable must be nvidia-smi");
  if (!Array.isArray(invocation.args) || invocation.args.length !== 2) {
    throw new TypeError("diagnostic must contain exactly the fixed query and format arguments");
  }
  if (invocation.args[0] !== QUERY_ARGUMENT || invocation.args[1] !== FORMAT_ARGUMENT) {
    throw new TypeError("diagnostic arguments must match the fixed read-only query");
  }
  return true;
}

function parseCell(cell) {
  const trimmed = cell.trim();
  if (trimmed === "N/A" || trimmed === "[N/A]") return null;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) && trimmed !== "" ? numeric : trimmed;
}

export function parseNvidiaSmiReadOnlyOutput(stdout) {
  if (typeof stdout !== "string") throw new TypeError("nvidia-smi output must be text");
  if (stdout.trim() === "") return [];
  return stdout
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const cells = line.split(",").map(parseCell);
      if (cells.length !== NVIDIA_SMI_QUERY_FIELDS.length) {
        throw new TypeError("unexpected nvidia-smi column count");
      }
      return Object.fromEntries(NVIDIA_SMI_QUERY_FIELDS.map((field, index) => [field, cells[index]]));
    });
}

export async function runNvidiaSmiReadOnlyDiagnostic({ executor = execFileAsync, timeoutMs = 5000 } = {}) {
  if (typeof executor !== "function") throw new TypeError("executor must be a function");
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new RangeError("timeoutMs must be a positive integer");
  const invocation = buildNvidiaSmiReadOnlyInvocation();
  assertReadOnlyNvidiaSmiInvocation(invocation);
  const { stdout } = await executor(invocation.file, [...invocation.args], {
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
  });
  return Object.freeze({
    diagnostic: "nvidia-smi-readonly",
    mutationAllowed: false,
    devices: Object.freeze(parseNvidiaSmiReadOnlyOutput(stdout).map(Object.freeze)),
  });
}
