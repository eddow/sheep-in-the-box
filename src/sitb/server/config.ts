import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import type { Configuration, Connection, IDatabaseDriver, Options } from '@mikro-orm/core'

export default function config(env: Record<string, string|undefined>): Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> {
	return {	// No glob-like path: it's supposed to work but of course does not
		entities: ['./src/entities/*.ts', './src/entities/sitb/*.ts'],
		entitiesTs: ['./src/entities/*.ts', './src/entities/sitb/*.ts'],
		metadataProvider: TsMorphMetadataProvider,
		// TODO: this last part should be project-dependant
		type: "mongo",
		highlighter: new MongoHighlighter(),
		clientUrl: env.MONGODB_URI
	};
}