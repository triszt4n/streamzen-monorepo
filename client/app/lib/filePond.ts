import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { registerPlugin } from 'react-filepond'

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize)
