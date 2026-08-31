/**
 * Zet de gebouwde site op de gh-pages-tak van deze repo.
 *
 * Waarom niet via GitHub Actions: daarvoor moet het token de `workflow`-scope
 * hebben, en die heeft niet iedereen. Dit werkt met een gewone push.
 *
 * Draaien met: npm run deploy
 */

import { execFileSync } from 'node:child_process'
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
const run = (cmd, args, opties = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', ...opties })

const remote = git('remote', 'get-url', 'origin')
const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/)
if (!match) throw new Error(`Kan eigenaar en repo niet uit de remote halen: ${remote}`)

const [, eigenaar, repo] = match
// Een repo die eindigt op .github.io staat op de wortel van het domein.
const wortel = repo.toLowerCase() === `${eigenaar.toLowerCase()}.github.io`
const base = wortel ? '/' : `/${repo}/`
const site = `https://${eigenaar.toLowerCase()}.github.io`
const adres = `${site}${wortel ? '' : `/${repo}/`}`

console.log(`\nBouwen voor ${adres}\n`)
run('npm', ['run', 'build'], {
  env: { ...process.env, VITE_BASE: base, VITE_SITE_URL: site },
})

// GitHub Pages draait standaard Jekyll, dat mappen met een _ negeert.
writeFileSync(join('dist', '.nojekyll'), '')

const werkmap = '.gh-pages-tmp'
if (existsSync(werkmap)) rmSync(werkmap, { recursive: true, force: true })

// Een losse repo in dist: zo blijft de geschiedenis van de bron ongemoeid en
// bevat de gh-pages-tak alleen het gebouwde resultaat.
run('git', ['init', '-q', '-b', 'gh-pages'], { cwd: 'dist' })
run('git', ['add', '-A'], { cwd: 'dist' })
run('git', ['-c', 'user.name=deploy', '-c', 'user.email=deploy@local', 'commit', '-q', '-m', 'Publiceren'], {
  cwd: 'dist',
})
run('git', ['push', '--force', remote, 'gh-pages:gh-pages'], { cwd: 'dist' })
rmSync(join('dist', '.git'), { recursive: true, force: true })

console.log(`\nKlaar. Over een minuut staat hij op:\n  ${adres}\n`)
console.log('Eenmalig instellen: repo → Settings → Pages → Source: "Deploy from a branch" → gh-pages / (root)\n')
