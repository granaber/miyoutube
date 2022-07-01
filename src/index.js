import figlet from 'figlet'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'

import YoutubeMp3Downloader from 'youtube-mp3-downloader'
const PATH_SAVE = '/Users/angelgranadillo/Music/miyoutube/'

function DownloadYouTube(code) {
  var YD = new YoutubeMp3Downloader({
    ffmpegPath: '/usr/local/bin/ffmpeg', // FFmpeg binary location
    outputPath: PATH_SAVE, // Output file location (default: the home directory)
    youtubeVideoQuality: 'highestaudio', // Desired video quality (default: highestaudio)
    queueParallelism: 2, // Download parallelism (default: 1)
    progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
    allowWebm: true // Enable download from WebM sources (default: false)
  })

  //Download video and save as MP3 file
  YD.download(code)
  const spinner = ora('Iniciando Download').start()

  YD.on('finished', function (err, data) {
    const { file, youtubeUrl } = data
    spinner.stop()
    console.log(chalk.blue(`Grabado con : ${file}`))
    console.log(chalk.redBright(`URL: ${youtubeUrl}`))
  })

  YD.on('error', function (error) {
    console.log('Hay un error ', error)
    spinner.stop()
  })

  YD.on('progress', function (data) {
    const {
      progress: { percentage }
    } = data

    const porcent = Math.round(percentage)
    spinner.text = `Cargando ${porcent}%`
  })
}

function Questions() {
  const quesT = {
    type: 'input',
    name: 'URL',
    message: chalk.white('Pasame el URL de Youtube?'),
    default: 'https://....',
    validate(input) {
      const done = this.async()

      const { erro } = mycode(input)

      if (erro) {
        done(chalk.white.bgRed.bold('UFFF este URL no tiene el code que necesito'))
        return
      }
      done(null, true)
    }
  }

  inquirer.prompt(quesT).then(async ({ URL }) => {
    const { code } = mycode(URL)
    DownloadYouTube(code)
  })
}

function mycode(url) {
  const { 1: code } = url.split('=')
  return { erro: typeof code === 'undefined', code }
}

console.log(
  figlet.textSync('Mi Youtube Download', {
    font: 'Standard',
    horizontalLayout: 'controlled smushing',
    verticalLayout: 'default',
    whitespaceBreak: true
  })
)

Questions()
