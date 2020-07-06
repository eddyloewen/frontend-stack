module.exports = {
	'*.{js,json}': ['eslint --fix'],
	'*.{css}': ['stylelint --fix'],
	'*.{js,json,css,yaml}': ['prettier --write'],
};
