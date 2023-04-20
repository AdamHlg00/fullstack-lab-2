const getAlbumsButton = document.getElementById('getAlbumsButton')
const addButton = document.getElementById('addButton')

// The displayAlbums() function will run as soon as the window is loaded
window.addEventListener('load', displayAlbums)

// Takes care of displaying all albums and their buttons
async function displayAlbums() {
  let data = await getAlbums()

  // Takes the table from index.html
  const tableBody = document.getElementById('showAlbums')

  // Creates new table row for each album
  data.forEach(album => {
    const row = document.createElement('tr')

    // Cell for album id, uncomment if you want this visible in the table
    /*let idCell = document.createElement('td')
    idCell.textContent = album._id
    row.appendChild(idCell)*/

    // Cell for album title
    let titleCell = document.createElement('td')
    titleCell.textContent = album.title
    row.appendChild(titleCell)

    // Cell for album artist
    let artistCell = document.createElement('td')
    artistCell.textContent = album.artist
    row.appendChild(artistCell)

    // Cell for album year, uncomment if you want this visible in the table
    /*let yearCell = document.createElement('td')
    yearCell.textContent = album.year
    row.appendChild(yearCell)*/

    // Cell for delete button
    let deleteButtonCell = document.createElement('td')
    let deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'

    // Event handler for delete button
    deleteButton.addEventListener('click', async () => {
      // Removes delete button so it can be replaced by confirm/cancel
      deleteButtonCell.removeChild(deleteButton)

      let confirmDeleteButton = document.createElement('button')
      confirmDeleteButton.textContent = 'Confirm'

      // Adds confirmation button to the cell
      deleteButtonCell.appendChild(confirmDeleteButton)

      // Event handler for confirming deletion
      confirmDeleteButton.addEventListener('click', async () => {
        const albumId = album._id

        //const albumIdJSON = JSON.stringify(albumId)
        let idData = await deleteAlbum(albumId)

        // Disdplays some information in a label
        document.getElementById('albumInfo').innerHTML = idData.title + ' deleted! Page reload commencing..'
        setTimeout(() => { location.reload() }, 2000)     // Delay before page reload to update the table
      })

      let cancelDeleteButton = document.createElement('button')
      cancelDeleteButton.textContent = 'Cancel'

      // Adds cancelation button to the cell
      deleteButtonCell.appendChild(cancelDeleteButton)

      // Event handler for canceling deletion
      cancelDeleteButton.addEventListener('click', () => {
        // Replaces confirm/cancel with the original delete button
        deleteButtonCell.removeChild(confirmDeleteButton)
        deleteButtonCell.removeChild(cancelDeleteButton)
        deleteButtonCell.appendChild(deleteButton)
      })
    })

    deleteButtonCell.appendChild(deleteButton)
    row.appendChild(deleteButtonCell)

    // Cell for update button
    let updateButtonCell = document.createElement('td')
    let updateButton = document.createElement('button')
    updateButton.textContent = 'Update'

    // Event listener for the update button
    updateButton.addEventListener('click', async () => {
      // New 'submit' button
      let submitButton = document.createElement('button')
      submitButton.textContent = 'Submit'

      // New 'cancel' button
      let cancelUpdateButton = document.createElement('button')
      cancelUpdateButton.textContent = 'Cancel'

      // Field for entering new title
      let titleField = document.createElement('input')
      titleField.type = 'text'
      titleField.id = 'updateTitle'
      titleField.placeholder = 'Title'

      // Field for entering new artist
      let artistField = document.createElement('input')
      artistField.type = 'text'
      artistField.id = 'updateArtist'
      artistField.placeholder = 'Artist'

      // Field for entering new year
      let yearField = document.createElement('input')
      yearField.type = 'number'
      yearField.id = 'updateYear'
      yearField.placeholder = 'Year'

      // Removes update button and replaces it with submit/cancel and textboxes
      updateButtonCell.removeChild(updateButton)
      updateButtonCell.appendChild(titleField)
      updateButtonCell.appendChild(artistField)
      updateButtonCell.appendChild(yearField)
      updateButtonCell.appendChild(submitButton)
      updateButtonCell.appendChild(cancelUpdateButton)

      // Event listener for submit button
      submitButton.addEventListener('click', async () => {
        const albumId = album._id
        const albumData = {
          title: updateTitle.value,
          artist: updateArtist.value,
          year: updateYear.value
        }

        const albumDataJSON = JSON.stringify(albumData)
        let data = await updateAlbum(albumDataJSON, albumId)
        console.log(data)

        // Displays some information in a label
        document.getElementById('albumInfo').innerHTML = album.title + ' updated! Page reload commencing..'
        setTimeout(() => { location.reload() }, 2000)
      })

      // Event listener for cancel button
      cancelUpdateButton.addEventListener('click', () => {
        // Replaces submit/cancel buttons with the original update button
        updateButtonCell.removeChild(submitButton)
        updateButtonCell.removeChild(cancelUpdateButton)
        updateButtonCell.removeChild(titleField)
        updateButtonCell.removeChild(artistField)
        updateButtonCell.removeChild(yearField)
        updateButtonCell.appendChild(updateButton)
      })
    })

    updateButtonCell.appendChild(updateButton)
    row.appendChild(updateButtonCell)

    // Creates the ditails button
    let detailsButtonCell = document.createElement('td')
    let detailsButton = document.createElement('button')
    detailsButton.textContent = 'Details'

    // Event listener for details button
    detailsButton.addEventListener('click', async () => {
      const albumTitle = album.title

      let albumData = await getAlbumDetails(albumTitle)

      // Displays the album details in a label
      document.getElementById('albumInfo').innerHTML = JSON.stringify(albumData, null, 2)
    })

    detailsButtonCell.appendChild(detailsButton)
    row.appendChild(detailsButtonCell)

    // Appends the row to the table
    tableBody.appendChild(row)
  })
}

// Event listener for the add button
addButton.addEventListener('click', async event => {
  const albumData = {
    id: addId.value,
    title: addTitle.value,
    artist: addArtist.value,
    year: addYear.value
  }

  const albumDataJSON = JSON.stringify(albumData)

  let data = await addAlbum(albumDataJSON)
  console.log(data)
  if (data === 'Id already exist!' || data === 'Album already exist in database!') {
    return
  } else {
    // Displays some information in a label
    document.getElementById('albumInfo').innerHTML = data.title + ' added! Page reload commencing..'
    setTimeout(() => { location.reload() }, 2000)     // Delay before page reload to update table
  }
})

// Fetch for getting details about a specific album
async function getAlbumDetails(albumTitle) {
  try {
    let result = await fetch(`http://localhost:3000/api/albums/${albumTitle}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    })
    let rest = await result.json()
    return rest
  } catch (error) {
    console.log(error)
  }
}

// Fetch for updating information of an album
async function updateAlbum(albumData, albumId) {
  try {
    let result = await fetch(`http://localhost:3000/api/albums/${albumId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: albumData
    })
    let rest = await result.json()
    return rest
  } catch (error) {
    console.log(error)
  }
}

// Fetch for deleting an album
async function deleteAlbum(albumData) {
  try {
    let result = await fetch(`http://localhost:3000/api/albums/${albumData}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' }
    })
    let rest = await result.json()
    return rest
  } catch (error) {
    console.log(error)
  }
}

// Fetch for getting all albums
async function getAlbums() {
  try {
    let result = await fetch('http://localhost:3000/api/albums', {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    })
    console.log(result)
    let rest = await result.json()
    return rest
  } catch (error) {
    console.log(error)
  }
}

// Fetch for adding an album
async function addAlbum(albumData) {
  try {
    let result = await fetch('http://localhost:3000/api/albums', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: albumData
    })
    let rest = await result.json()
    return rest
  } catch (error) {
    console.log(error)
  }
}