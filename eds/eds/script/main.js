function setSelected(entityId) {
  const previouslySelected = document.querySelector('#institutionList .selected');
  if(previouslySelected) {
    previouslySelected.classList.remove('selected');
  }
  const newlySelected = document.getElementById("institution-" + entityId);
  newlySelected.classList.add('selected');
  input = document.getElementById('searchableSelectInput');
  input.value = newlySelected.innerText;
  filterInstitutions();
}

function filterInstitutions() {
  const input = document.getElementById('searchableSelectInput').value.toLowerCase();
  const listItems = document.getElementById('institutionList').children;
  for(let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const label = item.innerHTML.toLowerCase();
    if(label.includes(input)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }
}

function continueSelection() {
  const selected = document.querySelector('#institutionList .selected button');
  if (!selected) {
    alert('Please select an institution before continuing.');
    return;
  }

  const idpEntityID = selected.getAttribute('entityId');

  const urlParams = new URLSearchParams(window.location.search);
  const spEntityID = urlParams.get("entityID");
  const ret = urlParams.get("return");

  if (!spEntityID || !ret) {
    alert("Missing entityID or return parameter.");
    return;
  }

  const url = new URL(ret);
  url.searchParams.set("entityID", idpEntityID);      // IdP

  window.location.href = url.toString();
}

function resetSelection() {
  const previouslySelected = document.querySelector('#institutionList .selected');
  if(previouslySelected) {
    previouslySelected.classList.remove('selected');
  }
  document.getElementById('searchableSelectInput').value = '';
  filterInstitutions();
}

const institutions = fetch('/Shibboleth.sso/DiscoFeed')
  .then(res => res.json())
  .then(data => data.map((entry, index) => ({
    label: entry["DisplayNames"]?.[0]?.value || entry["entityID"],
    value: entry["entityID"],
    id: index
  })))
  .then(options => {
    const searchableSelect = document.getElementById('searchableSelect');
    for(const option of options) {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.id = option.id;
      button.innerHTML = option.label;
      button.setAttribute('entityId', option.value);
      button.onclick = () => {
        setSelected(option.id);
      };
      li.id = "institution-" + option.id;
      li.appendChild(button);
      document.getElementById('institutionList').appendChild(li);
    }
  })

