const extractBtn = document.getElementById('extract');

extractBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extract
  })
})

function extract() {
  try {
    const maxElementsInCSV = 200;
    const elements = Array.from(document.getElementsByClassName('grid-linha'));
    if (elements.length > maxElementsInCSV) {
      const qtdToDelete = elements.length - maxElementsInCSV;
      elements.splice(elements.length - qtdToDelete, qtdToDelete);
    }

    const oldLinkElement = document.getElementById('saveCSV');
    if (oldLinkElement) {
      oldLinkElement.remove();
    }

    const linkElement = document.createElement('a');
    const fileName = `extract-${new Date().getTime()}.csv`;
    linkElement.id = 'saveCSV';
    linkElement.textContent = `Download ${fileName}`;
    linkElement.download = fileName;
    linkElement.href = `data:text/csv,${elements.map(e => e.innerText.replaceAll('\n', ';')).join('\n')}`;
    document.getElementsByClassName('listagem')[0].prepend(linkElement);
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
}

function extractQuestions () {
	const iframe = document.getElementById('iframecontent');

	const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

	const divs = iframeDocument.querySelectorAll('.on-fast-test-item');
	divs.forEach((div, index) => {
	  const questionTitleElement = div.querySelector('.on-fast-test-question-text');
	  const questionTitle = questionTitleElement.textContent.trim();
	  const answerElements = div.querySelectorAll('.on-fast-test-answer-text');
	  const answers = Array.from(answerElements).map(answer => answer.textContent.trim());

	  const options = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	  const result = `${questionTitle}\n\n${answers.map((answer, i) => `${options[i + 1]}. ${answer}`).join('\n')}\n\n`;

	  console.log(`Item ${index + 1}:\n${result}`);
	});
};
