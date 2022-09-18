export const playAudio = (file_name:string) => {
    let audio = new Audio(require('../sounds/'+file_name)).play()
    if (audio !== undefined) {
        audio.catch((e:Error)=>{
          console.log(e)
        })
    } else {
        console.log('audio is undefined')
    }
}