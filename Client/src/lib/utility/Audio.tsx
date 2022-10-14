export const playAudio = (file_name:string) => {
    let audio = new Audio('/assets/sounds/'+file_name).play()
    if (audio !== undefined) {
        audio.catch((e:Error)=>{
          console.log(e)
        })
    } else {
        console.log('audio is undefined')
    }
}