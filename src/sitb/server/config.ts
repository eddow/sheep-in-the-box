import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { ReflectMetadataProvider } from "@mikro-orm/core";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'
import * as entities from '$entities';

export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {
		entities: Object.values(entities),
		metadataProvider: ReflectMetadataProvider,
		// TODO: this last part should be project-dependant
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}