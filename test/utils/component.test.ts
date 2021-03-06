import * as assert from 'assert';
import * as path from 'path';
import * as ts from "typescript";
import * as fs from 'fs';
import * as _ from 'lodash';

import { Component, IComponentBinding } from '../../src/utils/component/component';

const TEST_FILES_ROOT = path.join(__dirname, '../../../test/test_files');

const getTestFilePath = (filename: string) => path.join(TEST_FILES_ROOT, filename);

describe('Give Component class', () => {
	describe('when calling parse in AST mode', () => {
		const files = ['component_simple.ts', 'component_comments.ts', 'test.component.js', 'component_consts.ts', 'component_staticFields.ts'];

		testFiles(files);

		it('and controllerAs property exists then controller alias is set', async () => {
			const { path, sourceFile } = getSourceFile('component_ctrlAlias.ts');

			const component = await Component.parse({ path, sourceFile }, []);

			assert.equal(component[0].controllerAs, 'vm');
		});

		it('and controllerAs property does not exist then default controller alias is set', async () => {
			const { path, sourceFile } = getSourceFile('component_noCtrlAlias.ts');

			const component = await Component.parse({ path, sourceFile }, []);

			assert.equal(component[0].controllerAs, '$ctrl');
		});

		it('with component_importLiteral.ts file then a properly parsed component is returned', async () => {
			const { path, sourceFile } = getSourceFile('component_importLiteral.ts');

			const components = await Component.parse({ path, sourceFile }, []);

			assertComponent(components);
		});

		it('with component_importClass.ts file then a properly parsed component is returned', async () => {
			const { path, sourceFile } = getSourceFile('component_importClass.ts');

			const components = await Component.parse({ path, sourceFile }, []);

			assertComponent(components);
		});

		it('with component_importReexportedLiteral.ts file then a properly parsed component is returned', async () => {
			const { path, sourceFile } = getSourceFile('component_importReexportedLiteral.ts');

			const components = await Component.parse({ path, sourceFile }, []);

			assertComponent(components);
		});

		it('with component_importReexportedClass.ts file then a properly parsed component is returned', async () => {
			const { path, sourceFile } = getSourceFile('component_importReexportedClass.ts');

			const components = await Component.parse({ path, sourceFile }, []);

			assertComponent(components);
		});
	});
});

function assertComponent(components: Component[]) {
	assert.equal(components.length, 1);
	assert.equal(components[0].name, 'exampleComponent');
	assert.equal(components[0].bindings.length, 1);
	assert.equal(components[0].bindings[0].name, 'exampleBinding');
	assert.equal(components[0].bindings[0].type, '<');
}

function getSourceFile(name: string) {
	const path = getTestFilePath(name);
	const sourceFile = ts.createSourceFile(name, fs.readFileSync(path, 'utf8'), ts.ScriptTarget.ES5, true);

	return { path, sourceFile };
}

function testFiles(files: string[]) {
	files.forEach((file) => {
		it(`with '${file}' file then a properly parsed component is returned`, async () => {
			const path = getTestFilePath(file);
			const sourceFile = ts.createSourceFile(file, fs.readFileSync(path, 'utf8'), ts.ScriptTarget.ES5, true);

			const component = await Component.parse({ path, sourceFile }, []);

			assert.equal(component.length, 1);
			assert.equal(component[0].name, 'exampleComponent');
			const bindings = component[0].bindings.map(b => _.pick(b, ['name', 'htmlName', 'type']));
			assert.deepEqual(bindings, [
				{
					name: "config",
					htmlName: "config",
					type: "<"
				} as IComponentBinding,
				{
					name: "data",
					htmlName: "data",
					type: "<"
				} as IComponentBinding
			]);
		});
	});
}
