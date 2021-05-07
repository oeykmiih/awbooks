//---------------- Summon On Load ----------------

parse_on_load();

textHighlights(); // summon on load


//---------------- Summon On Event ----------------

editor.addEventListener('keyup', debounce(evt => {const { value } = evt.target;push_preview(value);textHighlights();}, 200));
editor.addEventListener('scroll', handleScroll, false);

new_button.addEventListener('click', new_file, false);
save_button.addEventListener('click', save_file, false);
upd_button.addEventListener('change', read_file);
dwn_button.addEventListener('click', download_markdown , false);
prt_imp_button.addEventListener('click', print_pages, false);
toc_button.addEventListener('click', get_toc, false);
split_pane.addEventListener('mousedown', init_drag, false);
scale_box.addEventListener('keyup', evt => {
  const {
    value
  } = evt.target;
  setScale(value);
})