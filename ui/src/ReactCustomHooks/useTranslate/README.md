# useTranslate

useTranslate is a custom hook which enables internationalisation in the UI by
abstracting strings of text being rendered into named keys with inserts. The
hook can be provided a bundle of translations, which will then be merged with
a set of commonly used strings. See [this guide](#format) for a summary of the format
used by the hook for translation keys and values, and how this works for
multiple locales. The hook can also be provided a locale directly as a second
parameter. If not provided, it will default to use `navigator.language` from
the browser.

The hook returns a function, which when called can be provided two parameters;
the key of the translation to use, and a JSON object, containing any inserts.
When called, the translation function will determine the user's locale, find
a the string to use, and perform any required inserts (mapping the key provided
in the object to the first instance found in the string, delimited by `${}`).

For example,

`<p>Hello John Doe!</p>`

would become (in your React code)

`<p>{translate('WELCOME', {name: 'John Doe'})</p>`

where the translation provided when creating the hook was:

```
{
    en: {
        WELCOME: 'Hello ${name}!'
    }
}
```

The result the user would see is:

`<p>Hello John Doe!</p>`

In addition, if required, React components can be inserted as well:

```
<p>{translate('WELCOME_WITH_LINK', {
    name: 'John Doe',
    link: (<a href={'/users/john.doe'} key={'account-link'}>
                {translate('ACCESS_ACCOUNT')}
           </a>)
    })</p>

```
with config

```
{
    en: {
        WELCOME_WITH_LINK: 'Hello ${name}! ${link}',
        ACCESS_ACCOUNT: 'Access your account here'
    }
}
```

will return/render to the user:

`<p>Hello John Doe! <a href='/users/john.doe'>Access your account here</a></p>`

Do note however that when passing JSX as an insert, it must have a key
associated with it ([as per this best practise](https://reactjs.org/docs/lists-and-keys.html#keys)).

Finally, if you want to use a translated string in an HTML attribute, such as
an `aria-label` or `alt`, you can do so as follows:

```
<img src={myImage.png} alt={translate('IMAGE_ALT', {}, true)} />

```
with config

```
{
    en: {
        IMAGE_ALT: 'Descriptive text for this image'
    }
}
```

will return/render to the user:

`<img src={myImage.png} alt='Descriptive text for this image' />`

Note in this case the extra parameter at the end of the translate call. This
causes the hook to return a string, rather than JSX (as attribute values need
to be strings). _Do note that object inserts passed in when called using this
method will be returned as `[object Object]` - as this is how JS objects are
printed when put into a string._

## Usage

In your code, you would use the hook as follows:

```
import { translations } from 'MyComponent.assets.js';
const translate = useTranslate(translations);
```

and as shown above, call the returned function where required:

```
<p>{translate('WELCOME', {name: 'John Doe'})</p>
```

Your provided translations will be merged with the default provided set, which
will make up the corpus available for you to use. We recommend 'namespacing'
your translation keys, eg `MYCOMPONENT_TEXT`, to reduce the chance of
collisions.

The full signiture of the returned function is as follows:

`translate(key, inserts, returnAsString)`

- `key` - string, required - the translation key to use to render the desired
value
- `inserts` - object, optional - a JS object where the keys match with the
above specified `${}` delimeters. At run time, the value for this key is
inserted into the returned value.
- `returnAsString` - boolean, optional, defaults to false - by default, the
hook will return JSX. By setting this to true, a string value will be returned
instead. As described above, useful for HTML attribute use cases.

## Format

The format of the translation bundles is as follows:

```
{
    <locale> : {
        <key> : <value>
    }
}
```

As per usage above, a user of `useTranslate` would provide translations in this
format, from a file with the `*.i18n.json` suffix.
