<check-boxes>
  <!-- Use Materialize CSS -->
  <h3 class="center-align">{ opts.title }</h3>
  <p each="{ opts.options }">
    <label>
      <input if="{ checked == false }" type="checkbox" class="filled-in" onclick="{ parent.toggle }" />
      <input if="{ checked == true }" type="checkbox" class="filled-in" checked="checked" onclick="{ parent.toggle }" />
      <span>{ label }</span>
    </label>
  </p>
  <button ref="thebutton" class="btn waves-effect waves-light" type="submit" name="action">Update
    <i class="material-icons right">done</i>
  </button>

  <script>
    let self = this;
    self.options = opts.options;

    self.toggle = function (e) {
      var item = e.item;
      item.checked = !item.checked;
    }

    let onFormSubmit = function(evt) {
      evt.preventDefault();
      console.log('options', self.options);
    }

    self.on('mount', function(eventName) {
      self.refs.thebutton.onclick = onFormSubmit;
    });
  </script>
</check-boxes>