// @ts-nocheck
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { json, text } from '@sveltejs/kit';

export async function POST({ request }) {
  let resources = await request.json();

  try {
    await fs.writeFile('/Users/braypolkinghorne/Documents/code/Rake/testing/crossplane-learning/test.json', JSON.stringify(resources)); // Write the JSON string to a file

    let result = await new Promise((resolve, reject) => {
      exec('python3 /Users/braypolkinghorne/Documents/code/Rake/testing/crossplane-learning/translate.py run', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject({
            status: 500,
            body: 'error'
          });
          return;
        }

        resolve({
          status: 200,
          body: 'success'
        });
        console.log(stdout);
      });
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      body: error
    };
  }
}