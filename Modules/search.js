function findData(data, s) {
	let tempData;
	let TempDataArr = []
	Object.values(data).forEach(value => {
		tempData = value.public.songs
	})
	Object.values(tempData).forEach(value => {
		TempDataArr.push(value)
	})
	const found = TempDataArr.filter(element => {
		let title = element.info.title.toLocaleLowerCase().includes(s)
		let artist = element.info.artist.toLocaleLowerCase().includes(s)
		let genre = element.info.genre.toLocaleLowerCase().includes(s)
		let conditions =  title || artist || genre
		return conditions
	})
	for(let i = 0; i<found.length; i++){
		for(let j = i+1; j<found.length; j++){
			if(found[i].info.title.indexOf(s)>found[j].info.title.indexOf(s)){
				const saved = found[i]
				found[i] = found[j]
				found[j] = saved
			}
		}
	}
	return found
}


export default findData