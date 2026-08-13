import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";
import bcrypt from 'bcrypt';
import v8 from 'v8';
import fs from 'fs';

const toMB = (bytes) => Math.round(bytes / 1024 / 1024);

// Lê o teto de memória imposto ao container (cgroup v2, com fallback pro v1)
function containerMemoryLimit() {
  const paths = [
    '/sys/fs/cgroup/memory.max',
    '/sys/fs/cgroup/memory/memory.limit_in_bytes',
  ];

  for (const path of paths) {
    try {
      const raw = fs.readFileSync(path, 'utf8').trim();
      if (raw === 'max') return 'sem limite';
      const bytes = Number(raw);
      // valores absurdos (ex. 2^63) significam "sem limite" no cgroup v1
      if (Number.isFinite(bytes) && bytes < 2 ** 53) return `${toMB(bytes)} MB`;
    } catch {
      // caminho não existe nesta versão de cgroup, tenta o próximo
    }
  }

  return 'desconhecido';
}

function logMemory(label) {
  const heap = v8.getHeapStatistics();
  const { rss } = process.memoryUsage();

  console.log(
    `[mem/${label}] container=${containerMemoryLimit()} | ` +
    `heap_limit=${toMB(heap.heap_size_limit)} MB | ` +
    `heap_used=${toMB(heap.used_heap_size)} MB | rss=${toMB(rss)} MB`
  );
}

Meteor.startup(async () => {
  logMemory('startup');
  setInterval(() => logMemory('tick'), 30000);

  const hash = await bcrypt.hash('galaxy-test', 10);
  console.log('bcrypt OK:', hash.slice(0, 20));
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`
  );
});
