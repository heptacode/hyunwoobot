import { State } from '@/types';
import { AudioResource, createAudioResource } from '@discordjs/voice';
import { createReadStream } from 'node:fs';

export async function playResource(
  state: State,
  source: any,
  volume?: number
): Promise<AudioResource<any>> {
  const resource = createAudioResource(createReadStream(source), { inlineVolume: true });
  resource.volume.setVolume(volume ?? state.volume);
  state.player.play(resource);
  state.connection.subscribe(state.player);
  return resource;
}
