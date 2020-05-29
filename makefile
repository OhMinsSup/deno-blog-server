install:
	deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts

run:
	deno run --unstable --allow-write --allow-net --allow-env --allow-read --allow-plugin server.ts